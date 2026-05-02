import pandas as pd
import numpy as np
import os

def generate_synthetic_data(n=20000):
    np.random.seed(42)
    
    words_positive = ["love", "great", "amazing", "excellent", "good", "happy", "best", "perfect"]
    words_negative = ["bad", "terrible", "awful", "worst", "sad", "hate", "angry", "poor"]
    words_neutral = ["the", "is", "a", "of", "and", "in", "to", "it", "that"]
    
    texts, labels = [], []
    for _ in range(n):
        sentiment = np.random.choice([0, 1, 2], p=[0.3, 0.4, 0.3]) # 0=Neg, 1=Neu, 2=Pos
        num_words = np.random.randint(5, 20)
        sentence = []
        
        for _ in range(num_words):
            if sentiment == 0:
                sentence.append(np.random.choice(words_negative + words_neutral, p=[0.5/len(words_negative)]*len(words_negative) + [0.5/len(words_neutral)]*len(words_neutral)))
            elif sentiment == 2:
                sentence.append(np.random.choice(words_positive + words_neutral, p=[0.5/len(words_positive)]*len(words_positive) + [0.5/len(words_neutral)]*len(words_neutral)))
            else:
                sentence.append(np.random.choice(words_neutral))
        
        texts.append(" ".join(sentence))
        labels.append(sentiment)
        
    df = pd.DataFrame({
        "post_id": [f"POST_{i:06d}" for i in range(n)],
        "user_id": [f"USER_{np.random.randint(1000):04d}" for _ in range(n)],
        "timestamp": pd.date_range(start="2024-01-01", periods=n, freq="min").strftime("%Y-%m-%d %H:%M:%S"),
        "text": texts,
        "likes": np.random.randint(0, 1000, size=n),
        "retweets": np.random.randint(0, 500, size=n),
        "sentiment": labels
    })
    
    SCHEMA = {
        "post_id":"string", "user_id":"string", "timestamp":"string", 
        "text":"string", "likes":"int64", "retweets":"int64", "sentiment":"int64"
    }
    df = df.astype(SCHEMA)
    
    os.makedirs("../data", exist_ok=True)
    df.to_parquet("../data/social_posts.parquet")
    print("Generated synthetic data.")
    print("Shape:", df.shape)

if __name__ == "__main__":
    generate_synthetic_data()
