import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer

# The feature is just 'text'
pre = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=1000, ngram_range=(1,2)))
])
