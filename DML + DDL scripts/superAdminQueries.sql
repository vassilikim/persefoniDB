-- 3.1.6 Returns the top 3 category pairs of books in lendings
SELECT g1.genre AS genre1, g2.genre AS genre2, COUNT(l.book_ID) AS lendings
FROM Genre g1
JOIN Genre g2 ON g1.book_ID=g2.book_ID AND g1.genre<g2.genre
LEFT JOIN Lending l ON g1.book_ID=l.book_ID
GROUP BY g1.genre, g2.genre
ORDER BY lendings DESC
LIMIT 3;

-- 3.1.7 Returns all the writers with at least five less books than the one with the most books
WITH writer_books AS (
  SELECT CONCAT(w.first_name, ' ', w.last_name) AS writer, COUNT(wr.book_ID) AS books
  FROM Writer w 
  LEFT JOIN Writes wr ON wr.writer_ID=w.ID
  GROUP BY w.first_name, w.last_name
  ORDER BY books DESC
),
max_books AS (
  SELECT books 
  FROM writer_books
  LIMIT 1
)
SELECT w.writer, w.books
FROM writer_books w
JOIN max_books m
WHERE w.books<=m.books-5;



