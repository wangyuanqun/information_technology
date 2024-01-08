
from pydantic import BaseModel, Field

class Node(BaseModel):
    """Representation of a pipeline in the system."""
    ID: str
    module_function: str
    inputs: list
    params: list