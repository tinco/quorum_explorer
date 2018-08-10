FROM ruphin/webserve

COPY dist /usr/share/nginx/html
COPY ./node_modules/@webcomponents/webcomponentsjs /usr/share/nginx/html/@webcomponents/webcomponentsjs
COPY ./node_modules/babel-polyfill /usr/share/nginx/html/babel-polyfill
