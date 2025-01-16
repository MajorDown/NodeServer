import NodeServer from './NodeServer';
import { HTTPRequest, HttpResponse } from './types';

const app = new NodeServer();

// Route GET pour la page d'accueil
app.get('/', (req: HTTPRequest, res: HttpResponse) => {
  res.send(200, 'Bienvenue sur la page d\'accueil');
});

// Route GET pour la page "À propos"
app.get('/about', (req: HTTPRequest, res: HttpResponse) => {
  res.json(200, { message: 'Bienvenue sur la page À propos' });
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

// Démarrage du serveur
app.listen(3000, () => {
  console.log('Serveur en écoute sur le port 3000');
});
