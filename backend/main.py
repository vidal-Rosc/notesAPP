from http.client import HTTPException
from fastapi import FastAPI, Request # type: ignore
from fastapi.responses import JSONResponse # type: ignore
from routes.auth import auth_router
from routes.notes import notes_router
from routes.protected import protected_router
from fastapi.middleware.cors import CORSMiddleware
from core.config import ALLOWED_ORIGINS

app = FastAPI(
    title="API de Notes",
    description="API to manage notes with JWT authentication & refresh Tokens",
    version="1.0.0",
)

# Define allowed origins (the frontend URL)
origins = [
    "https://v-r-notes-frontend-4e1ff360aa1f.herokuapp.com",  # Frontend URL Puede ser definido en .config como ALLOWED_ORIGINS
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite estos orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Registrar las rutas de autenticación con el prefijo /auth
app.include_router(auth_router)

# Registrar las rutas de notas con el prefijo /notes
app.include_router(notes_router)

# Registrar las rutas de notas con el prefijo /protected
app.include_router(protected_router)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Ruta de prueba
@app.get("/")
async def read_root():
    return {"message": "API working correctly"}




