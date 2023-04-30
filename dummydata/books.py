from faker import Faker
import random

fake = Faker()

def generate_books(num_books):
    books = []
    for i in range(num_books):
        title = fake.sentence(nb_words=4, variable_nb_words=True, ext_word_list=None)
        publisher = fake.company()
        isbn = fake.isbn13()
        page_number = random.randint(50, 1000)
        summary = fake.text(max_nb_chars=255)
        copies = random.randint(1, 10)
        image = fake.image_url()
        lang = fake.language_code()
        keywords = ', '.join(fake.words(nb=5))
        school_id = random.randint(1, 3)
        books.append((title, publisher, isbn, page_number, summary, copies, image, lang, keywords, school_id))
    return books

def generate_insert_script(books):
    script = "INSERT INTO Book (title, publisher, ISBN, page_number, summary, copies, image, lang, keywords, school_ID) VALUES\n"
    values = []
    for book in books:
        value_str = "('{}', '{}', '{}', {}, '{}', {}, '{}', '{}', '{}', {}),".format(*book)
        values.append(value_str)
    script += '\n'.join(values)[:-1] + ';'
    return script

if __name__ == '__main__':
    books = generate_books(100)
    script = generate_insert_script(books)
    print(script)
