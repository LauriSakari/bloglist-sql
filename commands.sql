/* SQL commands used */

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL 
);

ALTER TABLE blogs     
  ADD likes integer default 0;


INSERT INTO blogs (author, url, title, likes) 
  values ('Michael Chan', 'https://reactpatterns.com/', 'React patterns', 7);

INSERT INTO blogs (author, url, title, likes) 
  values ('Edsger W. Dijkstra', 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', 'Go To Statement Considered Harmful', 5);

SELECT * FROM notes;