MATCHING_PROMPT = """You are an expert data labeler evaluating model outputs for correctness. Your task is to compare the model's answer with the ground truth answer and assign a score based on their match.

<Rubric>
  A correct match:
  - Contains the same factual information as the ground truth answer
  - Covers all key points found in the ground truth answer
  - Has no contradictions with the ground truth answer
  - Uses terminology consistent with the ground truth answer
  - May use different wording but preserves the same meaning

  When scoring, you should penalize:
  - Missing information that appears in the ground truth answer
  - Adding incorrect information not found in the ground truth answer
  - Contradicting the ground truth answer
  - Misrepresenting key concepts from the ground truth answer
</Rubric>

<Instructions>
  - Focus only on comparing the output to the ground truth answer
  - Exact wording is not required, but meaning should match
  - Ignore style, formatting, and verbosity differences
  - Score based on information correctness and completeness
</Instructions>

<Reminder>
  Your goal is to evaluate how well the model's answer matches the ground truth answer in terms of factual content.
</Reminder>

<output>
{outputs}
</output>

<ground_truth_answer>
{reference_outputs}
</ground_truth_answer>

Compare these two answers and score their match on a scale from 0.0 to 1.0, where:
- 1.0 means the answers match perfectly in content
- 0.0 means the answers completely contradict each other or have no matching information

Return your score and brief explanation.
"""