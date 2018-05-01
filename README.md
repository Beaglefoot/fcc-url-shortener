# URL Shortener Microservice

The third project in API section on [freeCodeCamp](https://www.freecodecamp.org/challenges/url-shortener-microservice).

### The user stories are:

* I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
* If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
* When I visit that shortened URL, it will redirect me to my original link.

### Examples of usage:

#### Shortened link creation:

Input
```
curl -X POST 'https://fcc-url-shortener-bf.glitch.me/shorten' -d '{ "url": "http://yandex.ru" }' -H 'Content-Type: application/json'
```

Output
```
{"shortenedUrl":"https://fcc-url-shortener-bf.glitch.me/b00nzpd"}
```

#### Redirection:

Input
```
curl -X GET 'https://fcc-url-shortener-bf.glitch.me/b00nzpd'
```

Output
```
Found. Redirecting to http://yandex.ru
```
