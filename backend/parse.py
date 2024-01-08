# this takes a node_name eg n1 and node_data eg {"fnname":"merge" ...}
def parse(node_name: str, node_data: dict) -> str:
    output_str = "output_vals[\"" + node_name + "\"] = "
    output_str += node_data["fnname"] + "("
    output_str += ','.join("output_vals[\""+x+"\"]" for x in node_data["inputs"])
    output_str += '' if node_data["inputs"] == [] else ','
    output_str += ','.join(key+"="+val for key, val in node_data["params"].items())
    output_str += ')'
    return output_str
