import NodeServer from './src/NodeServer.ts';
import type { HTTPRequest, HttpResponse } from './src/types.ts';

const app = new NodeServer();

app.static('/upload', () => console.log('Fichier téléchargé !'));

// // Route GET pour la page d'accueil
// app.get('/', (req: HTTPRequest, res: HttpResponse) => {
//   res.send(200, 'Bienvenue sur la page d\'accueil');
// });

// Route GET pour la page "À propos"
app.get('/about', (req: HTTPRequest, res: HttpResponse) => {
  res.send(200, 'Bienvenue sur la page À propos');
});

// Route dynamique GET /user/:id
app.get('/user/:id', (req: HTTPRequest, res: HttpResponse) => {
  const { id } = req.params;
  res.json(200, { message: `Détails de l'utilisateur avec l'ID ${id}` });
});

// Route POST pour soumettre des données
app.post('/submit', (req: HTTPRequest, res: HttpResponse) => {
  res.json(201, { status: 'success', message: 'Données reçues' });
});

// Route PUT pour mettre à jour une ressource
app.put('/update', (req: HTTPRequest, res: HttpResponse) => {
  res.send(200, 'Ressource mise à jour');
});

// Route DELETE pour supprimer une ressource
app.delete('/delete', (req: HTTPRequest, res: HttpResponse) => {
  res.send(204, 'Ressource supprimée');
});

// Ici, on personnalise le "fallback" GET
// Si aucune route GET plus haut ne correspond, on tombe ici plutôt que sur la 404 par défaut
// app.get('*', (req: HTTPRequest, res: HttpResponse) => {
//   res.writeHead(404, { 'Content-Type': 'text/html' });
//   res.end(`
//     <h1>404</h1>
//     <p>Oups, cette page GET n'existe pas !</p>
//   `);
// });

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur lancé sur le port 3000');
});
