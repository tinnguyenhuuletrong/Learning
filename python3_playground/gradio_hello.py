import gradio as gr

# Data function


def arithmetic_operation(num1, num2, operation):
    if operation == 'Add':
        result = num1 + num2
    elif operation == 'Subtract':
        result = num1 - num2
    elif operation == 'Multiply':
        result = num1 * num2
    else:
        result = num1 / num2
    return result


# User interface
input1 = gr.inputs.Number(label="Number 1")
input2 = gr.inputs.Number(label="Number 2")
operation = gr.inputs.Radio(
    ['Add', 'Subtract', 'Multiply', 'Divide'], label="Select operation")
output = gr.outputs.Textbox(label="Result")

title = "Arithmetic Operations"
description = "Perform arithmetic operations on two numbers"
examples = [["5", "3", "Add"], ["10", "5", "Multiply"], ["15", "4", "Divide"]]

iface = gr.Interface(fn=arithmetic_operation, inputs=[
                     input1, input2, operation], outputs=output, title=title, description=description, examples=examples)

# Launch
iface.launch()
