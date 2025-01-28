from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from dependency_injector.wiring import inject, Provide
from src.containers import Container

security = HTTPBearer()


@inject
async def verify_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service_url: str = Depends(Provide[Container.auth_service_url]),
    http_client: httpx.AsyncClient = Depends(Provide[Container.http_client])
) -> dict:
    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )

    try:
        response = await http_client.get(
            f"{auth_service_url}/api/auth_service/v1/verify-token",
            headers={"Authorization": f"Bearer {token}"}
        )

        if response.status_code == status.HTTP_200_OK:
            response_data = response.json()
            user_data = response_data["data"]["user"]

            print(f"Verify success user_id {user_data['id']} Url: {
                  request.client.host}{request.url.path}")

            return user_data

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized"
        )

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth service unavailable"
        )
