let clients = [];

export const addClient = (client) => {
  clients.push(client);
};

export const removeClient = (client) => {
  clients = clients.filter(c => c !== client);
};

export const emitUpdate = (type, data = {}) => {
  const payload = JSON.stringify({ type, data });
  clients.forEach(client => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      console.error('Error sending event to client:', e);
    }
  });
};
