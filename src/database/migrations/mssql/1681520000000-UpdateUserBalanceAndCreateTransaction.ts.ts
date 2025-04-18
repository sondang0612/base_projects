import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUpdateUserBalanceStoredProcedure1681520000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR ALTER PROCEDURE UpdateUserBalanceAndCreateTransaction
                @PlayerCode NVARCHAR(255),
                @Uuid NVARCHAR(255),
                @ProviderCode NVARCHAR(255),
                @GameCode NVARCHAR(255),
                @GameName NVARCHAR(255),
                @GameNameEn NVARCHAR(255),
                @GameCategory NVARCHAR(255) = NULL,
                @RoundId NVARCHAR(255),
                @Type NVARCHAR(50),
                @Amount DECIMAL(16, 4),
                @ReferenceUuid NVARCHAR(255) = NULL,
                @RoundStarted BIT = 0,
                @RoundFinished BIT = 0,
                @Details NVARCHAR(MAX) = NULL,
                @CreatedBy NVARCHAR(255) = 'devaplay@system.com',
                @Status NVARCHAR(50) OUTPUT,
                @UpdatedBalance DECIMAL(16, 4) OUTPUT
            AS
            BEGIN
                SET NOCOUNT ON;
                DECLARE @CurrentBalance DECIMAL(16, 4);
                DECLARE @RealAmount DECIMAL(16, 4);
                DECLARE @ReferenceAmount DECIMAL(16, 4);
              
            
                IF EXISTS (SELECT 1 FROM [game-transactions] WHERE uuid = @Uuid)
                BEGIN
                    SELECT @CurrentBalance = balance FROM [users] WHERE playerCode = @PlayerCode;
                    SET @UpdatedBalance = @CurrentBalance;
                    SET @Status = 'AlreadyProcessed';
                    RETURN 0;
                END
            
            
                SELECT @CurrentBalance = balance FROM [users] WHERE playerCode = @PlayerCode;
                
            
                SET @UpdatedBalance = @CurrentBalance;
                SET @RealAmount = @Amount;
                SET @Status = 'OK';
            
                BEGIN TRY
                    BEGIN TRANSACTION;
                    
            
                    IF @Type = 'BET'
                    BEGIN
            
                        IF @Amount > @CurrentBalance
                        BEGIN
                            SET @Status = 'InsufficientPlayerBalance';
                            COMMIT TRANSACTION;
                            RETURN 0;
                        END
                        
                        SET @UpdatedBalance = @CurrentBalance - @Amount;
                    END
                    ELSE IF @Type = 'WIN'
                    BEGIN
                        SET @UpdatedBalance = @CurrentBalance + @Amount;
                    END
                    ELSE IF @Type = 'CANCEL_BET'
                    BEGIN
            
                        IF NOT EXISTS (SELECT 1 FROM [game-transactions] WHERE uuid = @ReferenceUuid AND type = 'BET')
                        BEGIN
                            SET @Status = 'ReferenceNotFound';
                            COMMIT TRANSACTION;
                            RETURN 0;
                        END
                        
            
                        IF @Amount IS NULL
                        BEGIN
                            SELECT @RealAmount = amount FROM [game-transactions] WHERE uuid = @ReferenceUuid;
                        END
                        ELSE
                        BEGIN
                            SET @RealAmount = @Amount;
                        END
                        
                        SET @UpdatedBalance = @CurrentBalance + @RealAmount;
                    END
                    ELSE IF @Type = 'CANCEL_WIN'
                    BEGIN
            
                        IF NOT EXISTS (SELECT 1 FROM [game-transactions] WHERE uuid = @ReferenceUuid AND type = 'WIN')
                        BEGIN
                            SET @Status = 'ReferenceNotFound';
                            COMMIT TRANSACTION;
                            RETURN 0;
                        END
                        
            
                        IF @Amount IS NULL
                        BEGIN
                            SELECT @RealAmount = amount FROM [game-transactions] WHERE uuid = @ReferenceUuid;
                        END
                        ELSE
                        BEGIN
                            SET @RealAmount = @Amount;
                        END
                        
            
                        IF @RealAmount > @CurrentBalance
                        BEGIN
                            SET @Status = 'InsufficientPlayerBalance';
                            COMMIT TRANSACTION;
                            RETURN 0;
                        END
                        
                        SET @UpdatedBalance = @CurrentBalance - @RealAmount;
                    END
                    ELSE IF @Type = 'OTHER'
                    BEGIN
            
                        IF @Amount < 0 AND (@CurrentBalance + @Amount) < 0
                        BEGIN
                            SET @Status = 'InsufficientPlayerBalance';
                            COMMIT TRANSACTION;
                            RETURN 0;
                        END
                        
                        SET @UpdatedBalance = @CurrentBalance + @Amount;
                    END
                    ELSE
                    BEGIN
                        SET @Status = 'UnhandledTransactionType';
                        COMMIT TRANSACTION;
                        RETURN 0;
                    END
            
            
                    UPDATE [users]
                    SET balance = @UpdatedBalance
                    WHERE playerCode = @PlayerCode;
            
            
                    INSERT INTO [game-transactions] (
                        uuid,
                        playerCode,
                        providerCode,
                        gameCode,
                        gameName,
                        gameName_en,
                        gameCategory,
                        roundId,
                        type,
                        amount,
                        referenceUuid,
                        roundStarted,
                        roundFinished,
                        details,
                        createdBy,
                        createdAt,
                        updatedAt
                    )
                    VALUES (
                        @Uuid,
                        @PlayerCode,
                        @ProviderCode,
                        @GameCode,
                        @GameName,
                        @GameNameEn,
                        @GameCategory,
                        @RoundId,
                        @Type,
                        @RealAmount,
                        @ReferenceUuid,
                        @RoundStarted,
                        @RoundFinished,
                        @Details,
                        @CreatedBy,
                        GETDATE(),
                        GETDATE()
                    );
            
                    COMMIT TRANSACTION;
                    RETURN 0;
                END TRY
                BEGIN CATCH
                    ROLLBACK TRANSACTION;
                    SET @Status = 'Fail';
                    RETURN 1;
                END CATCH
            END
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP PROCEDURE IF EXISTS UpdateUserBalanceAndCreateTransaction
        `);
  }
}
