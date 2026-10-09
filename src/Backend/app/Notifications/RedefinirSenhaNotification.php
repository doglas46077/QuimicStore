<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RedefinirSenhaNotification extends Notification
{
    use Queueable;

    public string $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = rtrim(config('app.frontend_url', 'http://localhost:5173'), '/');
        $urlFront = $frontendUrl . '/redefinir-senha?token=' . $this->token . '&email=' . urlencode($notifiable->email);

        return (new MailMessage)
            ->subject('Solicitação de Redefinição de Senha - QuimicStore')
            ->greeting('Olá, ' . ($notifiable->nome ?? 'Usuário') . '!')
            ->line('Recebemos uma solicitação de redefinição de senha para a sua conta.')
            ->action('Redefinir Senha', $urlFront)
            ->line('Se você não solicitou a alteração de senha, nenhuma ação adicional é necessária.')
            ->salutation('Atenciosamente, Equipe QuimicStore');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}