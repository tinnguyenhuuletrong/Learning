# Start Local (Docker)

https://github.com/ollama/ollama?tab=readme-ov-file

```sh
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# Inference
docker exec -it ollama ollama run llama2
```


# Start with cli

```sh 
ollama serve
```