<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #334155;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 20px;
            margin: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(79, 70, 229, 0.08), 0 4px 24px rgba(0, 0, 0, 0.05);
        }

        /* Header */
        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><path fill="%23ffffff" fill-opacity="0.1" d="M0,0h120v120H0V0z M60,10c27.6,0,50,22.4,50,50s-22.4,50-50,50S10,87.6,10,60S32.4,10,60,10z"/></svg>');
            opacity: 0.3;
        }

        .logo {
            width: 60px;
            height: 60px;
            background: white;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            position: relative;
            z-index: 1;
        }

        .logo-text {
            color: #4f46e5;
            font-weight: 800;
            font-size: 20px;
            letter-spacing: -0.5px;
        }

        .header h1 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
        }

        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 8px;
            position: relative;
            z-index: 1;
        }

        /* Content */
        .content {
            padding: 40px 30px;
        }

        .greeting {
            font-size: 18px;
            margin-bottom: 30px;
            color: #1e293b;
        }

        .greeting strong {
            color: #4f46e5;
            font-weight: 700;
        }

        /* Status Card */
        .status-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 30px 0;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
        }

        .status-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 6px;
            background: {{
                $action === 'confirm' ? '#10b981' :
                ($action === 'complete' ? '#3b82f6' :
                ($action === 'reject' ? '#ef4444' :
                ($action === 'reschedule' ? '#f59e0b' : '#4f46e5')))
            }};
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 20px;
            background: {{
                $action === 'confirm' ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' :
                ($action === 'complete' ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' :
                ($action === 'reject' ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' :
                ($action === 'reschedule' ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)')))
            }};
            color: white;
            box-shadow: 0 4px 12px {{
                $action === 'confirm' ? 'rgba(16, 185, 129, 0.2)' :
                ($action === 'complete' ? 'rgba(59, 130, 246, 0.2)' :
                ($action === 'reject' ? 'rgba(239, 68, 68, 0.2)' :
                ($action === 'reschedule' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(79, 70, 229, 0.2)')))
            }};
        }

        .status-icon {
            font-size: 20px;
        }

        .status-message {
            font-size: 16px;
            color: #475569;
            line-height: 1.6;
        }

        /* Appointment Info */
        .appointment-info {
            background: white;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            padding: 30px;
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .info-row:last-child {
            border-bottom: none;
        }

        .info-label {
            font-size: 14px;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .info-value {
            font-weight: 600;
            color: #1e293b;
            font-size: 15px;
            text-align: right;
        }

        /* Notes Section */
        .notes-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #fbbf24;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
        }

        .notes-label {
            font-weight: 600;
            color: #92400e;
            font-size: 14px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .notes-content {
            color: #92400e;
            font-size: 14px;
            line-height: 1.5;
        }

        /* Button */
        .button-container {
            text-align: center;
            margin: 40px 0 20px;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 15px;
            box-shadow: 0 8px 20px rgba(79, 70, 229, 0.2);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(79, 70, 229, 0.3);
        }

        /* Footer */
        .footer {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: #64748b;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.2s;
        }

        .footer-link:hover {
            color: #4f46e5;
        }

        .footer-text {
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.5;
            margin-top: 20px;
        }

        /* Responsive */
        @media (max-width: 640px) {
            .container {
                border-radius: 16px;
            }

            .header {
                padding: 30px 20px;
            }

            .header h1 {
                font-size: 24px;
            }

            .content {
                padding: 30px 20px;
            }

            .appointment-info {
                padding: 20px;
            }

            .info-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }

            .info-value {
                text-align: left;
            }

            .button {
                padding: 14px 32px;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-text">DD</div>
            </div>
            <h1>DzDoctor Imagerie</h1>
            <p>Votre santé, notre priorité</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <p class="greeting">Bonjour <strong>{{ $patientName }}</strong>,</p>

            <!-- Status Card -->
            <div class="status-card">
                <!-- Status Badge -->
                @if($action === 'confirm')
                <div class="status-badge">
                    <span class="status-icon">✓</span>
                    <span>Rendez-vous Confirmé</span>
                </div>
                <p class="status-message">Votre rendez-vous a été confirmé avec succès. Nous vous attendons à la date prévue.</p>

                @elseif($action === 'reschedule')
                <div class="status-badge">
                    <span class="status-icon">↻</span>
                    <span>Rendez-vous Déplacé</span>
                </div>
                <p class="status-message">La date de votre rendez-vous a été modifiée selon les nouvelles informations ci-dessous.</p>

                @elseif($action === 'reject')
                <div class="status-badge">
                    <span class="status-icon">✗</span>
                    <span>Demande Refusée</span>
                </div>
                <p class="status-message">Malheureusement, votre demande n'a pas pu être acceptée pour le moment.</p>

                @elseif($action === 'complete')
                <div class="status-badge">
                    <span class="status-icon">✓</span>
                    <span>Examen Terminé</span>
                </div>
                <p class="status-message">Votre examen a été marqué comme terminé. Les résultats seront disponibles prochainement.</p>

                @else
                <div class="status-badge">
                    <span class="status-icon">ℹ️</span>
                    <span>Mise à jour Rendez-vous</span>
                </div>
                <p class="status-message">Votre rendez-vous a été mis à jour avec les informations suivantes.</p>
                @endif
            </div>

            <!-- Appointment Information -->
            <div class="appointment-info">
                <div class="info-row">
                    <span class="info-label">
                        <span style="color: #4f46e5;">🏥</span>
                        Centre médical
                    </span>
                    <span class="info-value">{{ $centerName }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">
                        <span style="color: #4f46e5;">🔬</span>
                        Type d'examen
                    </span>
                    <span class="info-value">{{ $examName }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">
                        <span style="color: #4f46e5;">📅</span>
                        Date et heure
                    </span>
                    <span class="info-value">{{ $date }}</span>
                </div>

                @if(!$isWalkin)
                <div class="info-row">
                    <span class="info-label">
                        <span style="color: #4f46e5;">👤</span>
                        Patient
                    </span>
                    <span class="info-value">{{ $patientName }}</span>
                </div>
                @endif
            </div>

            <!-- Notes / Reason -->
            @if($reason)
            <div class="notes-box">
                <div class="notes-label">
                    <span>📝</span>
                    Message important
                </div>
                <div class="notes-content">{{ $reason }}</div>
            </div>
            @endif

            <!-- Next Steps -->
            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 30px 0;">
                <div style="font-weight: 600; color: #065f46; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                    <span>💡</span>
                    Prochaines étapes
                </div>
                <ul style="color: #065f46; font-size: 14px; padding-left: 20px; margin: 0;">
                    @if($action === 'confirm' || $action === 'reschedule')
                    <li>Présentez-vous 15 minutes avant l'heure du rendez-vous</li>
                    <li>Apportez votre pièce d'identité et votre carte vitale</li>
                    <li>Suivez les éventuelles consignes de préparation</li>
                    @elseif($action === 'reject')
                    <li>Pour toute question, contactez directement le centre</li>
                    <li>Vous pouvez soumettre une nouvelle demande si nécessaire</li>
                    @elseif($action === 'complete')
                    <li>Les résultats seront disponibles dans votre espace patient</li>
                    <li>Un compte-rendu vous sera envoyé sous 48h ouvrables</li>
                    @endif
                </ul>
            </div>

            <!-- Action Button -->
            @if(!$isWalkin)
            <div class="button-container">
                <a href="{{ url('/dashboard') }}" class="button">
                    Accéder à mon espace patient
                </a>
            </div>
            @endif

            <!-- Contact Info -->
            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
                    Besoin d'aide ? Contactez-nous :
                </p>
                <p style="color: #4f46e5; font-weight: 600; font-size: 14px;">
                    📞 043 123 456 • ✉️ support@dzdoctor.dz
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="#" class="footer-link">Espace Patient</a>
                <a href="#" class="footer-link">Nos Centres</a>
                <a href="#" class="footer-link">Conditions d'utilisation</a>
                <a href="#" class="footer-link">Politique de confidentialité</a>
            </div>

            <p class="footer-text">
                &copy; {{ date('Y') }} DzDoctor. Tous droits réservés.<br>
                Cet email a été envoyé automatiquement. Veuillez ne pas y répondre.<br>
                DzDoctor SAS - 123 Rue de la Santé, Alger, Algérie
            </p>
        </div>
    </div>
</body>
</html>
