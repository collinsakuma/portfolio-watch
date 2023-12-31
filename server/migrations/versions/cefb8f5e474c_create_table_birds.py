"""create table birds

Revision ID: cefb8f5e474c
Revises: 
Create Date: 2023-07-27 11:04:58.444579

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'cefb8f5e474c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ticker', sa.String(), nullable=True),
    sa.Column('company_name', sa.String(), nullable=True),
    sa.Column('price', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=True),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('owned_stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('stock_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Float(), nullable=True),
    sa.Column('total_cost', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], name=op.f('fk_owned_stocks_stock_id_stocks')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_owned_stocks_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('stock_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Float(), nullable=True),
    sa.Column('share_price', sa.Float(), nullable=True),
    sa.Column('bought_total', sa.Integer(), nullable=True),
    sa.Column('sold_total', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], name=op.f('fk_transactions_stock_id_stocks')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watched_stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('stock_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['stock_id'], ['stocks.id'], name=op.f('fk_watched_stocks_stock_id_stocks')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_watched_stocks_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('watched_stocks')
    op.drop_table('transactions')
    op.drop_table('owned_stocks')
    op.drop_table('users')
    op.drop_table('stocks')
    # ### end Alembic commands ###
