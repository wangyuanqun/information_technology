import importlib
import inspect

def import_service(module_name: str, fid: int):
    """
    This function is to get the information of the uploaded service including
    fucntion names and id and parameters.

    Parameters:
    - module_name (str): the name of the module to import.
    - fid (int): the unique id of service.

    Returns:
    - dict: the service's information.
    - fid: the unique id of last service.
    """
    imported_module = importlib.import_module(module_name)

    # functions = [(name, obj) for name, obj in vars(imported_module).items() if callable(obj) and not name.startswith("__")]
    functions = [member for member in vars(imported_module).items() if inspect.isfunction(member[1])]

    list_in = []
    list_proc = []
    list_out = []

    for name, function in functions:
        # Getting the signature of the function
        signature = inspect.signature(function)
        parameters_with_types = []
        pid = 0
        for param_name, param in signature.parameters.items():
            param_type = param.annotation if param.annotation != inspect.Parameter.empty else None
            if "'" in str(param_type):
                typ = str(param_type).split("'")[1]
            elif "list" in str(param_type):
                typ = "list"
            else:
                typ = str(param_type)
            
            parameters_with_types.append({
                "pid": pid,
                "name": param_name,
                "displayname": param_name,
                "type": typ
            })
            pid += 1

        # Getting the docstring of the function
        doc = inspect.getdoc(function)
        if "type: in" in doc:
            list_in.append({
                "id": fid,
                "type": "in",
                "fnname": str(imported_module).split("'")[1]+'.'+name,
                "display": name,
                "params": parameters_with_types
            })
        elif "type: proc" in doc:
            list_proc.append({
                "id": fid,
                "type": "proc",
                "fnname": str(imported_module).split("'")[1]+'.'+name,
                "display": name,
                "params": parameters_with_types
            })
        elif "type: out" in doc:
            list_out.append({
                "id": fid,
                "type": "out",
                "fnname": str(imported_module).split("'")[1]+'.'+name,
                "display": name,
                "params": parameters_with_types
            })

        fid += 1
    return {
        "in": list_in,
        "proc": list_proc,
        "out": list_out
    }, fid