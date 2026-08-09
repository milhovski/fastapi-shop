from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..services.product_service import ProductService
from ..schemas.product import ProductResponse, ProductListResponse

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=ProductListResponse, status_code=status.HTTP_200_OK)
def get_products(
    q: str | None = Query(default=None, max_length=100),
    category_id: int | None = Query(default=None, ge=1),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=24, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = ProductService(db)
    normalized_query = q.strip() if q else None
    return service.search_products(normalized_query or None, category_id, offset, limit)

@router.get("/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def get_product(product_id: int, db: Session = Depends(get_db)):
    service = ProductService(db)
    return service.get_product_by_id(product_id)

@router.get("/category/{category_id}", response_model=ProductListResponse, status_code=status.HTTP_200_OK)
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    service = ProductService(db)
    return service.get_products_by_category(category_id)
