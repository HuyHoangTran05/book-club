import { DataTypes, Sequelize } from "sequelize";

const timestampColumns = {
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
};

const uuidPrimaryKey = (fieldName) => ({
  [fieldName]: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
});

export default {
  name: "202605300001-create-core-tables",

  async up(queryInterface, _Sequelize, transaction) {
    const options = { transaction };

    await queryInterface.createTable("members", {
      ...uuidPrimaryKey("member_id"),
      full_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      point_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "member",
      },
      is_deliverer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      account_status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "active",
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ...timestampColumns,
    }, options);

    await queryInterface.createTable("book_titles", {
      ...uuidPrimaryKey("book_id"),
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      publisher: {
        type: DataTypes.STRING(160),
        allowNull: true,
      },
      edition: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      publication_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true,
      },
      language: {
        type: DataTypes.STRING(60),
        allowNull: false,
        defaultValue: "Vietnamese",
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cover_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ...timestampColumns,
    }, options);

    await queryInterface.createTable("book_copies", {
      ...uuidPrimaryKey("copy_id"),
      book_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "book_titles",
          key: "book_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      condition: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "good",
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "available",
      },
      exchange_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "both",
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ...timestampColumns,
    }, options);

    await queryInterface.createTable("book_transactions", {
      ...uuidPrimaryKey("transaction_id"),
      copy_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "book_copies",
          key: "copy_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      giver_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      receiver_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      deliverer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "members",
          key: "member_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      transaction_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      giver_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      receiver_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      delivery_confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expected_return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    }, options);

    await queryInterface.createTable("point_histories", {
      ...uuidPrimaryKey("point_history_id"),
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "members",
          key: "member_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      transaction_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "book_transactions",
          key: "transaction_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      point_change: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    }, options);

    await queryInterface.sequelize.query(`
      ALTER TABLE members
        ADD CONSTRAINT members_point_balance_non_negative CHECK (point_balance >= 0),
        ADD CONSTRAINT members_role_check CHECK (role IN ('member', 'admin')),
        ADD CONSTRAINT members_account_status_check CHECK (account_status IN ('active', 'locked', 'inactive'));

      ALTER TABLE book_titles
        ADD CONSTRAINT book_titles_publication_year_check CHECK (publication_year IS NULL OR publication_year BETWEEN 0 AND 2100);

      ALTER TABLE book_copies
        ADD CONSTRAINT book_copies_condition_check CHECK (condition IN ('new', 'good', 'fair', 'worn')),
        ADD CONSTRAINT book_copies_status_check CHECK (status IN ('available', 'reserved', 'borrowed', 'exchanged', 'unavailable')),
        ADD CONSTRAINT book_copies_exchange_type_check CHECK (exchange_type IN ('permanent', 'lending', 'both'));

      ALTER TABLE book_transactions
        ADD CONSTRAINT book_transactions_transaction_type_check CHECK (transaction_type IN ('permanent', 'lending')),
        ADD CONSTRAINT book_transactions_status_check CHECK (status IN ('pending', 'completed', 'cancelled')),
        ADD CONSTRAINT book_transactions_distinct_members_check CHECK (giver_id <> receiver_id);

      ALTER TABLE point_histories
        ADD CONSTRAINT point_histories_point_change_not_zero CHECK (point_change <> 0),
        ADD CONSTRAINT point_histories_reason_check CHECK (reason IN ('initial_register', 'permanent_exchange', 'lending', 'delivery_bonus', 'admin_adjustment'));
    `, options);

    await queryInterface.addIndex("members", ["email"], {
      name: "members_email_idx",
      unique: true,
      transaction,
    });
    await queryInterface.addIndex("book_titles", ["title"], {
      name: "book_titles_title_idx",
      transaction,
    });
    await queryInterface.addIndex("book_titles", ["author"], {
      name: "book_titles_author_idx",
      transaction,
    });
    await queryInterface.addIndex("book_copies", ["status"], {
      name: "book_copies_status_idx",
      transaction,
    });
    await queryInterface.addIndex("book_copies", ["owner_id"], {
      name: "book_copies_owner_id_idx",
      transaction,
    });
    await queryInterface.addIndex("book_transactions", ["status"], {
      name: "book_transactions_status_idx",
      transaction,
    });
    await queryInterface.addIndex("point_histories", ["member_id", "created_at"], {
      name: "point_histories_member_created_at_idx",
      transaction,
    });
  },

  async down(queryInterface, _Sequelize, transaction) {
    const options = { transaction };

    await queryInterface.dropTable("point_histories", options);
    await queryInterface.dropTable("book_transactions", options);
    await queryInterface.dropTable("book_copies", options);
    await queryInterface.dropTable("book_titles", options);
    await queryInterface.dropTable("members", options);
  },
};
