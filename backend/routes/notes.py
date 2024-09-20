from fastapi import APIRouter, Depends, HTTPException
from typing import List
from core.schemas import NoteCreate, Note, NoteUpdate
from core.security import get_current_user
from core.config import MONGODB_URI, MONGODB_DB
from pymongo import MongoClient
from models.note import create_note, get_notes, get_note, update_note, delete_note

notes_router = APIRouter(
    prefix="/notes",
    tags=["Notas"]
)

# Conectar a MongoDB
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB]

# Ruta para crear una nueva nota
@notes_router.post("/", response_model=Note)
async def create_new_note(note: NoteCreate, current_user: str = Depends(get_current_user)):
    return create_note(db, current_user, note)

# Ruta para obtener todas las notas del usuario
@notes_router.get("/", response_model=List[Note])
async def read_notes(current_user: str = Depends(get_current_user)):
    return get_notes(db, current_user)

# Ruta para obtener una nota específica
@notes_router.get("/{note_id}", response_model=Note)
async def read_note(note_id: str, current_user: str = Depends(get_current_user)):
    note = get_note(db, current_user, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note NOT found")
    return note

# Ruta para actualizar una nota
@notes_router.put("/{note_id}", response_model=Note)
async def update_existing_note(note_id: str, note: NoteUpdate, current_user: str = Depends(get_current_user)):
    updated_note = update_note(db, current_user, note_id, note)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note NOT found")
    return updated_note

# Ruta para eliminar una nota
@notes_router.delete("/{note_id}", response_model=dict)
async def delete_existing_note(note_id: str, current_user: str = Depends(get_current_user)):
    success = delete_note(db, current_user, note_id)
    if not success:
        raise HTTPException(status_code=404, detail="Note NOT found")
    return {"message": "Nota eliminada exitosamente"}
