// import { registerRoute } from 'workbox-routing';
// import { NetworkOnly } from 'workbox-strategies';
// import { BackgroundSyncPlugin } from 'workbox-background-sync';

// const bgSyncPlugin = new BackgroundSyncPlugin('apiQueue', {
//   maxRetentionTime: 24 * 60,
// });

// registerRoute(
//   ({ url }) => url.pathname.startsWith('/api/'),
//   new NetworkOnly({
//     plugins: [bgSyncPlugin],
//   }),
//   'POST'
// );

// // Verifica quando o Service Worker é ativado
// self.addEventListener('activate', (event) => {
//     console.log('Service Worker ativado!');
    
//     // Usa `setInterval` para exibir um log a cada 10 segundos
//     setInterval(() => {
//       console.log('O Service Worker está rodando e registrando este log a cada 10 segundos');
//     }, 10000); // 10000ms = 10 segundos
//   });
  

  