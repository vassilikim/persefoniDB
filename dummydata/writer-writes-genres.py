from faker import Faker
import random

fake = Faker()

# SQL code to insert data into Writer table
insert_writer = "INSERT INTO Writer (first_name, last_name) VALUES ('{}', '{}');"

# SQL code to insert data into Writes table
insert_writes = "INSERT INTO Writes (writer_ID, book_ID) VALUES ({}, {});"

# SQL code to insert data into Genre table
insert_genre = "INSERT INTO Genre (book_ID, genre) VALUES ({}, '{}');"

# List of book genres
genres = ["Science fiction", "Mystery", "Romance", "Fantasy", "Horror", "Thriller", "Western", "Historical fiction", "Memoir", "Cooking", "Art", "Travel", "Biography", "Business", "Children literature", "Comics", "Drama"]

# List to store writer IDs for use in Writes table
writer_ids = []

# Generate data for each writer
for i in range(1, 101):
    first_name = fake.first_name()
    last_name = fake.last_name()

    # Insert writer data into Writer table
    sql = insert_writer.format(first_name, last_name)
    print(sql, end=' ')

    # Get the writer ID for this writer
    writer_id = i

    # Add writer ID to list
    writer_ids.append(writer_id)

# Generate and insert data for each book
for book_id in range(1, 101):
    # Generate 1-6 writers for this book
    num_writers = random.randint(1, 6)
    writers_for_book = random.sample(writer_ids, num_writers)
    for writer_id in writers_for_book:
        # Insert data into Writes table
        sql = insert_writes.format(writer_id, book_id)
        print(sql, end=' ')

    # Generate 1-3 genres for this book
    num_genres = random.randint(1, 3)
    genres_for_book = random.sample(genres, num_genres)
    for genre in genres_for_book:
        # Insert data into Genre table
        sql = insert_genre.format(book_id, genre)
        print(sql, end=' ')
    print()  # add newline after each book
