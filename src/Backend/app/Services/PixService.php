<?php

namespace App\Services;

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Common\EccLevel;

class PixService
{
    private string $chavePix;
    private string $beneficiario;
    private string $cidade;

    public function __construct(
        string $chavePix = 'doglasgsmacedo@gmail.com',
        string $beneficiario = 'QuimicStore',
        string $cidade = 'Indaiatuba'
    ) {
        $this->chavePix = $chavePix;
        $this->beneficiario = mb_substr(self::removerAcentos($beneficiario), 0, 25);
        $this->cidade = mb_substr(self::removerAcentos($cidade), 0, 15);
    }

    public function gerarPayload(float $valor, string $txId = '***'): string
    {
        $valorStr = number_format($valor, 2, '.', '');

        $gui = $this->formatarCampo('00', 'br.gov.bcb.pix');
        $chave = $this->formatarCampo('01', $this->chavePix);
        $merchantAccount = $this->formatarCampo('26', $gui . $chave);

        $tx = $this->formatarCampo('05', $txId ?: '***');
        $additionalData = $this->formatarCampo('62', $tx);

        $payload =
            '000201' .
            $merchantAccount .
            '52040000' .
            '5303986' .
            $this->formatarCampo('54', $valorStr) .
            '5802BR' .
            $this->formatarCampo('59', $this->beneficiario) .
            $this->formatarCampo('60', $this->cidade) .
            $additionalData .
            '6304';

        return $payload . $this->calcularCRC16($payload);
    }

    public function gerarQrCodeBase64(string $payload): string
    {
        $options = new QROptions([
            'outputType'  => 'svg',
            'imageBase64' => true,
            'eccLevel'    => EccLevel::M,
        ]);

        return (new QRCode($options))->render($payload);
    }

    private function formatarCampo(string $id, string $valor): string
    {
        $tamanho = str_pad((string) strlen($valor), 2, '0', STR_PAD_LEFT);
        return $id . $tamanho . $valor;
    }

    private function calcularCRC16(string $payload): string
    {
        $resultado = 0xFFFF;
        for ($i = 0; $i < strlen($payload); $i++) {
            $resultado ^= (ord($payload[$i]) << 8);
            for ($j = 0; $j < 8; $j++) {
                if (($resultado & 0x8000) !== 0) {
                    $resultado = (($resultado << 1) ^ 0x1021) & 0xFFFF;
                } else {
                    $resultado = ($resultado << 1) & 0xFFFF;
                }
            }
        }
        return strtoupper(str_pad(dechex($resultado), 4, '0', STR_PAD_LEFT));
    }

    private static function removerAcentos(string $texto): string
    {
        return preg_replace('/[`^~\'"]/', '', iconv('UTF-8', 'ASCII//TRANSLIT', $texto));
    }
}
