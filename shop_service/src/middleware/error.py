from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except HTTPException as http_exc:
            return JSONResponse(
                status_code=http_exc.status_code,
                content={"detail": http_exc.detail},
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"detail": f"Internal server error: {str(e)}"},
            )
