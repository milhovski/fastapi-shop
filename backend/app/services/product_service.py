from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..repositories.product_repository import ProductRepository
from ..repositories.category_repository import CategoryRepository
from ..schemas.product import ProductCreate, ProductResponse, ProductListResponse

class ProductService:
    def __init__(self, db: Session):
        self.product_repository = ProductRepository(db)
        self.category_repository = CategoryRepository(db)

    def get_all_products(self) -> ProductListResponse:
        products = self.product_repository.get_all()
        products_response = [ProductResponse.model_validate(product) for product in products]
        return ProductListResponse(products=products_response, total=len(products_response))

    def search_products(
        self,
        query: str | None = None,
        category_id: int | None = None,
        offset: int = 0,
        limit: int = 24,
    ) -> ProductListResponse:
        products, total = self.product_repository.search(query, category_id, offset, limit)
        return ProductListResponse(
            products=[ProductResponse.model_validate(product) for product in products],
            total=total,
        )

    def get_product_by_id(self, product_id: int) -> ProductResponse:
        product = self.product_repository.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product with ID {product_id} not found.")
        return ProductResponse.model_validate(product)

    def get_products_by_category(self, category_id: int) -> ProductListResponse:
        category = self.category_repository.get_by_id(category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Category with ID {category_id} not found.")
        products = self.product_repository.get_by_category(category_id)
        products_response = [ProductResponse.model_validate(product) for product in products]
        return ProductListResponse(products=products_response, total=len(products_response))

    def create_product(self, product_create: ProductCreate) -> ProductResponse:
        category = self.category_repository.get_by_id(product_create.category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Category with ID {product_create.category_id} does not exist.")
        product = self.product_repository.create(product_create)
        return ProductResponse.model_validate(product)
