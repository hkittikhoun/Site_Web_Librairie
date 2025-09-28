
const ModalMessageErreur = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000,
      }}
    >
      <h2>Erreur</h2>
      <p>{message}</p>
      <button onClick={onClose}>Fermer</button>
    </div>
  );
};

export default ModalMessageErreur;
