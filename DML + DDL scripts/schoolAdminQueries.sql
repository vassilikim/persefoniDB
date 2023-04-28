-- 3.2.2 Returns all users that have delayed the return of a book and have not returned it yet
SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name
FROM activeUsers u
JOIN Lending l ON u.ID=l.user_ID
WHERE l.must_be_returned_at<NOW() AND l.was_returned_at IS NULL AND u.first_name='Ciara' AND u.last_name='Kulas' AND TIMESTAMPDIFF(day, l.must_be_returned_at, NOW())=171;

-- 3.2.3 Returns average review rating per user
SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, ROUND(AVG(r.rating), 2) AS avg_rating
FROM activeUsers u
JOIN Review r ON r.user_ID=u.ID
WHERE u.username='teacher2' AND u.first_name='Ciara' AND u.last_name='Kulas'
GROUP BY u.username, u.first_name, u.last_name;

-- 3.2.3 Returns average review rating per category
SELECT g.genre, ROUND(AVG(r.rating), 2) AS avg_rating
FROM Genre g
JOIN Book b ON b.ID=g.book_ID
JOIN Review r ON r.book_ID=b.ID
WHERE g.genre='kpop'
GROUP BY g.genre;

-- 3.2.3 Returns average review rating per category and user
SELECT u.username, CONCAT(u.first_name, ' ', u.last_name) AS full_name, g.genre, ROUND(AVG(r.rating), 2) AS avg_rating
FROM Genre g
JOIN activeUsers u
JOIN Book b ON b.ID=g.book_ID
JOIN Review r ON r.book_ID=b.ID AND r.user_ID=u.ID
WHERE g.genre='horror' AND u.username='teacher2' AND u.first_name='Ciara' AND u.last_name='Kulas'
GROUP BY g.genre, u.username, u.first_name, u.last_name