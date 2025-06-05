import pandas as pd
import ast 
import pickle # save TF-IDF matix & movie title in a file 
from sklearn.feature_extraction.text import TfidfVectorizer # sklearn -> tools for datapreproccessing, algo's like regression etc 
from sklearn.metrics.pairwise import cosine_similarity
# print path of python env variable for debugging 
import sys 
print("PYTHON EXECUTABLE:", sys.executable)

# Load CSV
df = pd.read_csv('tmdb_5000_movies.csv')

# Parse genres and keywords
def extract_names(x):
    try:
        return [i['name'] for i in ast.literal_eval(x)]
    except:
        return []

# creates a new column in df and for earch row applies extract_names funciton to extract the gne
df['genres_list'] = df['genres'].apply(extract_names)
df['keywords_list'] = df['keywords'].apply(extract_names)

# Drop rows with missing overview
df = df.dropna(subset=['overview'])

# Create combined text for each movie
df['combined_text'] = df.apply(lambda row: 
    row['title'] + " " + 
    " ".join(row['genres_list']) + " " + 
    " ".join(row['keywords_list']) + " " +
    row['overview'], axis=1)

# Vectorize the combined text
vectorizer = TfidfVectorizer(stop_words='english') # stop word like 'the', 'and' etc do not help our modle in diffrentiating so we just remove em
tfidf_matrix = vectorizer.fit_transform(df['combined_text']) # create tfidf matrix where rows -> movies, columns -> geners

# Save the vectorized data and titles
pickle.dump((tfidf_matrix, df['title']), open("movie_vectors.pkl", "wb")) # saving two things -> title, objects in a file

# Dissimilar movie recommender
def recommend_dissimilar_movies(user_tags):
    # Load stored data
    tfidf_matrix, titles = pickle.load(open("movie_vectors.pkl", "rb"))

    # Vectorize user input
    user_vec = vectorizer.transform([user_tags])

    # Compute cosine similarity
    similarity_scores = cosine_similarity(user_vec, tfidf_matrix).flatten()

    # Get 10 least similar movies
    dissimilar_indices = similarity_scores.argsort()[:10]

    return titles.iloc[dissimilar_indices].tolist()

# Only run this if the script is executed directly, not when imported
if __name__ == "__main__":
    user_input = "romantic comedy teenage love"
    results = recommend_dissimilar_movies(user_input)

    print("Dissimilar movie suggestions:")
    for title in results:
        print("-", title)
