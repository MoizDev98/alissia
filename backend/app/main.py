from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"largos dias y placenteras noches pistoleros"}

