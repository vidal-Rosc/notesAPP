from pymongo.collection import Collection
from bson.objectid import ObjectId
from core.schemas import NoteCreate, Note, NoteUpdate
from datetime import datetime
from typing import List, Optional

def get_notes_collection(db) -> Collection:
    return db.get_collection("notes")

def create_note(db, user: str, note: NoteCreate) -> Note:
    notes = get_notes_collection(db)
    note_dict = note.dict()
    note_dict["owner"] = user
    note_dict["created_at"] = datetime.utcnow()
    note_dict["updated_at"] = datetime.utcnow()
    result = notes.insert_one(note_dict)
    note_dict["id"] = str(result.inserted_id)
    return Note(**note_dict)

def get_notes(db, user: str) -> List[Note]:
    notes = get_notes_collection(db)
    cursor = notes.find({"owner": user})
    return [Note(**{**note, "id": str(note["_id"])}) for note in cursor]

def get_note(db, user: str, note_id: str) -> Optional[Note]:
    notes = get_notes_collection(db)
    note = notes.find_one({"_id": ObjectId(note_id), "owner": user})
    if note:
        note["id"] = str(note["_id"])
        return Note(**note)
    return None

def update_note(db, user: str, note_id: str, note: NoteUpdate) -> Optional[Note]:
    notes = get_notes_collection(db)
    update_data = note.dict(exclude_unset=True)
    if "font_type" in update_data and not update_data["font_type"]:
        update_data["font_type"] = "Arial"  # Valor por defecto si se deja vacío
    update_data["updated_at"] = datetime.utcnow()
    result = notes.update_one(
        {"_id": ObjectId(note_id), "owner": user},
        {"$set": update_data}
    )
    if result.modified_count:
        return get_note(db, user, note_id)
    return None

def delete_note(db, user: str, note_id: str) -> bool:
    notes = get_notes_collection(db)
    result = notes.delete_one({"_id": ObjectId(note_id), "owner": user})
    return result.deleted_count > 0
