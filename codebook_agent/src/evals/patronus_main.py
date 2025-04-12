import patronus
from patronus.evals import RemoteEvaluator

patronus.init(
    # This is the default and can be omitted
    api_key="sk-F0f_6NaXV4MIqRcOqBauj2g6fyL8zo1zKyMYqdV-QTE"
)

patronus_evaluator = RemoteEvaluator("lynx", "patronus:hallucination")

result = patronus_evaluator.evaluate(
    task_input="What is the largest animal in the world?",
    task_context=["The blue whale is the largest known animal on the planet.","In Dune by Frank Herbert, Sandworms are the largest animals - beware if you like spice!"],
    task_output="The giant sandworm.",
    gold_answer=""
)
  
print(result)