# uvicorn main:app --reload
# .\venv\Scripts\python.exe -m uvicorn main:app --reload
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from collections import Counter
import math
import pickle

app = FastAPI()

# CORS Middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Loading data for TF-IDF
df = pd.read_csv("movies.csv")  
df["combined_text"] = df["plot_synopsis"].astype(str) + " " + df["tags"].astype(str) 

# tokenizing docs 
documents = df["combined_text"].tolist()
tokenized_docs = [doc.lower().split() for doc in documents]

# TF
# dictionary to store word: tf
tf_docs = []
for doc in tokenized_docs:
    word_counts = Counter(doc) 
    total_words = len(doc) 
    tf = {word: count / total_words for word, count in word_counts.items()}
    tf_docs.append(tf)

# IDF
N = len(tokenized_docs)
doc_freq = {}
for doc in tokenized_docs:
    for word in set(doc):
        doc_freq[word] = doc_freq.get(word, 0) + 1 #counter
idf = {word: math.log(N / freq) for word, freq in doc_freq.items()}

# TF-IDF 
tfidf_docs = []
for tf in tf_docs:
    tfidf = {word: tf_val * idf.get(word, 0) for word, tf_val in tf.items()}
    tfidf_docs.append(tfidf)

# request body format 
class PromptRequest(BaseModel):
    prompt: str

class TagsRequest(BaseModel):
    tags: str

# --- Cosine Similarity Function ---
def cosine_similarity(v1, v2):
    common = set(v1.keys()) & set(v2.keys())
    dot_product = sum(v1[word] * v2[word] for word in common) 
    norm1 = math.sqrt(sum(val**2 for val in v1.values())) # calculate norm
    norm2 = math.sqrt(sum(val**2 for val in v2.values()))
    if norm1 == 0 or norm2 == 0:
        return 0
    return dot_product / (norm1 * norm2) # for getting value b/w 0 and 1

# --- Recommendation Endpoint ---
@app.post("/recommend")

def recommend(request: PromptRequest):
    # TF-IDF for input 
    input_text = request.prompt.lower().split()
    word_counts = Counter(input_text)
    total_words = len(input_text)
    tf = {word: count / total_words for word, count in word_counts.items()}
    tfidf_input = {word: tf[word] * idf.get(word, 0) for word in tf}
    
    # Comparing 
    scores = [
        (i, cosine_similarity(tfidf_input, tfidf_docs[i]))
        for i in range(len(tfidf_docs))
    ]
 
    scores.sort(key=lambda x: x[1], reverse=True)
    top_results = [df.iloc[i]["title"] for i, score in scores[:5]]
    
    return {"recommendations": top_results}

@app.post("/eu-recommend")
def eu_recommend(request: TagsRequest):
    from eu import recommend_dissimilar_movies 
    results = recommend_dissimilar_movies(request.tags)
    return {"recommendations": results}
