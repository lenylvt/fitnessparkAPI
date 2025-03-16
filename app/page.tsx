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
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="text-sm">
            GET /api/qrcode/123/456/QR2
          </code>
        </div>
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
        <div className="bg-gray-100 p-4 rounded-lg">
          <code className="text-sm">
            GET /api/regenerate/123/abc123/1647123456/QR2
          </code>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Réponses</h2>
        <h3 className="text-xl font-semibold mb-2">Succès</h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <pre className="text-sm">
{`{
  "success": true,
  "path": "/qrcode-123-456-QR2.png",
  "number": "456"
}`}
          </pre>
        </div>
        <h3 className="text-xl font-semibold mb-2">Erreur</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm">
{`{
  "success": false,
  "message": "Message d'erreur"
}`}
          </pre>
        </div>
      </section>
    </div>
  );
}
