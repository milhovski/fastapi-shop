from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..repositories.category_repository import CategoryRepository
from ..schemas.category import CategoryCreate, CategoryResponse

class CategoryService:
    def __init__(self, db: Session):
        self.repository = CategoryRepository(db)

    def get_all_categories(self) -> List[CategoryResponse]:
        categories = self.repository.get_all()
        return [CategoryResponse.model_validate(category) for category in categories]

    def get_category_by_id(self, category_id: int) -> CategoryResponse:
        category = self.repository.get_by_id(category_id)
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Category with ID {category_id} not found.")
        return CategoryResponse.model_validate(category)

    def create_category(self, category_create: CategoryCreate) -> CategoryResponse:
        existing_category = self.repository.get_by_slug(category_create.slug)
        if existing_category:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category with this slug already exists.")
        category = self.repository.create(category_create)
        return CategoryResponse.model_validate(category)
