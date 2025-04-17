import { Shield, Lock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function SecurityStatus() {
  const securityFeatures = [
    {
      name: "Quantum-Secure Encryption",
      description: "Your data is protected with post-quantum encryption algorithms",
      status: "active",
      icon: Shield,
    },
    {
      name: "Federated Learning",
      description: "AI models are trained across institutions without sharing your data",
      status: "active",
      icon: Lock,
    },
    {
      name: "Multi-Factor Authentication",
      description: "Additional security layer for account access",
      status: "active",
      icon: CheckCircle2,
    },
    {
      name: "Biometric Verification",
      description: "Use fingerprint or face recognition for sensitive transactions",
      status: "inactive",
      icon: AlertTriangle,
    },
  ]

  const securityScore = 85

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Security Score</h3>
          <span className="text-lg font-bold">{securityScore}%</span>
        </div>
        <Progress value={securityScore} className="h-2" />
        <p className="text-sm text-muted-foreground">
          Your account has strong security measures in place. Enable biometric verification for maximum protection.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Security Features</h3>
        <div className="grid gap-4">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
              <div
                className={`rounded-full p-2 ${
                  feature.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{feature.name}</h4>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      feature.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {feature.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Advanced Security Technologies</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-medium">CNN & LSTM Models</h4>
            <p className="text-sm text-muted-foreground">
              Our neural networks analyze transaction patterns in real-time to detect anomalies and potential fraud.
            </p>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-medium">Synthetic Data Generation</h4>
            <p className="text-sm text-muted-foreground">
              Advanced diffusion models create realistic transaction data to train our AI system on rare fraud
              scenarios.
            </p>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-medium">Post-Quantum Cryptography</h4>
            <p className="text-sm text-muted-foreground">
              Future-proof encryption that protects against quantum computing threats to traditional cryptography.
            </p>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-medium">Federated Learning</h4>
            <p className="text-sm text-muted-foreground">
              Secure, large-scale collaboration across financial institutions without sharing sensitive customer data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
