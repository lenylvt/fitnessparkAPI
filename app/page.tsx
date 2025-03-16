import Image from "next/image";

export default function Home() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold mb-8">FitnessPark QR Code Generator API</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Générer un QR Code</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            GET /api/qrcode/{"{id}"}/{"{number}"}/{"{version}"}
          </code>
        </div>
        <h3 className="text-xl font-semibold mb-2">Paramètres</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><code>id</code> : Identifiant unique</li>
          <li><code>number</code> : Numéro à encoder</li>
          <li><code>version</code> : Version du QR code (QR1 ou QR2)</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Exemple</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            GET /api/qrcode/123/456/QR2
          </code>
        </div>
        <p className="text-sm text-gray-600">
          Retourne directement l'image PNG du QR code
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Régénérer un QR Code</h2>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            GET /api/regenerate/{"{id}"}/{"{signature}"}/{"{timestamp}"}/{"{version}"}
          </code>
        </div>
        <h3 className="text-xl font-semibold mb-2">Paramètres</h3>
        <ul className="list-disc pl-6 mb-4">
          <li><code>id</code> : Identifiant unique</li>
          <li><code>signature</code> : Signature du QR code original</li>
          <li><code>timestamp</code> : Timestamp du QR code original</li>
          <li><code>version</code> : Version du QR code (QR1 ou QR2)</li>
        </ul>
        <h3 className="text-xl font-semibold mb-2">Exemple</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            GET /api/regenerate/123/abc123/1647123456/QR2
          </code>
        </div>
        <p className="text-sm text-gray-600">
          Retourne directement l'image PNG du QR code si la signature est valide
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reverse Engineering</h2>
        
        <h3 className="text-xl font-semibold mb-2">Méthode GET</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            GET /api/reverse/{"{id}"}/{"{signature}"}/{"{timestamp}"}/{"{version}"}
          </code>
        </div>
        <h4 className="text-lg font-semibold mb-2">Paramètres</h4>
        <ul className="list-disc pl-6 mb-4">
          <li><code>id</code> : Identifiant unique</li>
          <li><code>signature</code> : Signature (sg) du QR code</li>
          <li><code>timestamp</code> : Timestamp (t) du QR code</li>
          <li><code>version</code> : Version (v) du QR code (QR1 ou QR2)</li>
        </ul>
        <h4 className="text-lg font-semibold mb-2">Exemple</h4>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            GET /api/reverse/5337919/bc31f7/1742138031/QR1
          </code>
        </div>

        <h3 className="text-xl font-semibold mb-2 mt-8">Méthode POST</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <code className="text-sm">
            POST /api/reverse
          </code>
        </div>
        <h4 className="text-lg font-semibold mb-2">Corps de la requête</h4>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm">
{`{
  "id": 5337919,
  "sg": "bc31f7",
  "t": 1742138031,
  "v": "QR1"
}`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold mb-2">Réponse en cas de succès</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm">
{`{
  "success": true,
  "number": "373dcbdd0c56682f602e609432ceaf35",
  "originalData": {
    "id": 5337919,
    "sg": "bc31f7",
    "t": 1742138031,
    "v": "QR1"
  }
}`}
          </pre>
        </div>
        <p className="text-sm text-gray-600">
          Retrouve le numéro original à partir des données du QR code
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Réponses d'erreur</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm">
{`{
  "error": "Message d'erreur"
}`}
          </pre>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          En cas d'erreur, l'API renvoie un objet JSON avec un message d'erreur
        </p>
      </section>
    </div>
  );
}
