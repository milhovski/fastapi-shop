from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from ..models.product import Product
from ..schemas.product import ProductCreate

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).all()

    def search(
        self,
        query: str | None = None,
        category_id: int | None = None,
        offset: int = 0,
        limit: int = 24,
    ) -> tuple[List[Product], int]:
        products_query = self.db.query(Product)

        if query:
            # Treat SQL wildcard characters as text so user input cannot broaden
            # the search unexpectedly. ILIKE remains case-insensitive.
            escaped = query.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
            pattern = f"%{escaped}%"
            products_query = products_query.filter(
                or_(
                    Product.name.ilike(pattern, escape="\\"),
                    Product.description.ilike(pattern, escape="\\"),
                )
            )

        if category_id is not None:
            products_query = products_query.filter(Product.category_id == category_id)

        total = products_query.with_entities(func.count(Product.id)).scalar() or 0
        products = (
            products_query.options(joinedload(Product.category))
            .order_by(Product.created_at.desc(), Product.id.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return products, total

    def get_by_id(self, product_id: int) -> Optional[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).filter(Product.id == product_id).first()

    def get_by_category(self, category_id: int) -> List[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).filter(Product.category_id == category_id).all()

    def create(self, product_data: ProductCreate) -> Product:
        db_product = Product(**product_data.model_dump())
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def get_multiple_by_ids(self, product_ids: List[int]) -> List[Product]:
        return self.db.query(Product).options(joinedload(Product.category)).filter(Product.id.in_(product_ids)).all()
