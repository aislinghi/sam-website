const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const ejs = require('ejs');

const app = express();
const port = process.env.PORT || 3000;

// Make environment variables available to templates
app.locals.process = { env: process.env };

// Serve static files - add multiple static directories
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/testimonials', async (req, res) => {
    try {
        const testimonialFiles = await fs.readdir(path.join(__dirname, 'testimonials'));
        const testimonials = await Promise.all(
            testimonialFiles.map(async (file) => {
                const content = await fs.readFile(path.join(__dirname, 'testimonials', file), 'utf-8');
                return {
                    content: marked.parse(content),
                    date: file.split('-')[0]
                };
            })
        );
        res.render('testimonials', { testimonials });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading testimonials');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 