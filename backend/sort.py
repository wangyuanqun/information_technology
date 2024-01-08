# Topological sort the pipeline
# this determines the execution order to ensure nodes are only executed after all of their dependencies

import backend.Node as nd


def pipeline_sort(nodes: list[nd.Node]) -> list[str]:
    """
    Helper function to sort the Nodes before executing the pipeline. It is essentially
    just a topological sort which ensures every Node is executed before any Node that
    depends on its output, indicated by the Node's inputs parameter.

    Credit: https://en.wikipedia.org/wiki/Topological_sorting (comments describing the
    algorithm)
    """
    node_graph = dict((node.ID, [input for input in node.inputs]) for node in nodes)
    sorted_nodes = []

    # L ← Empty list that will contain the sorted elements
    L = []
    # S ← Set of all nodes with no incoming edge
    S = {node for node in node_graph if node_graph[node] == []}

    # while S is not empty do
    while len(S) != 0:
        #    remove a node n from S
        n = S.pop()
        #    add n to L
        L.append(n)
        sorted_nodes.append(next((x for x in nodes if x.ID == n), None)
)
    #    for each node m with an edge e from n to m do
        for m in (node for node in node_graph if n in node_graph[node]):
    #        remove edge e from the graph
            node_graph[m].remove(n)
    #        if m has no other incoming edges then
            if node_graph[m] == []:
    #            insert m into S
                S.add(m)
    # if graph has edges then
    if sum(1 for node in node_graph if node_graph[node] != []) != 0:
    #    return error   (graph has at least one cycle)
        raise ValueError("Invalid Pipeline Configuration: cycle detected.")
    # else
    else:
    #    return L   (a topologically sorted order)
        return sorted_nodes


test_nodes = [
    nd.Node(
        ID="n0",
        module_function="process.handle_missing.main_missing_imputation",
        inputs=["n1"],
        params=["knn", [], 5],
    ),
    nd.Node(
        ID="n1",
        module_function="collection.yahoo.stock_price",
        inputs=[],
        params=["AAPL", "2010-1-1", "2023-1-1"],
    ),
    nd.Node(
        ID="n2",
        module_function="automl.intialise_model.initialise_model",
        inputs=["n3"],
        params=["Close", "demo"],
    ),
    nd.Node(
        ID="n3",
        module_function="process.split_dataset.train_test_split",
        inputs=["n0"],
        params=[0.25],
    ),
]
