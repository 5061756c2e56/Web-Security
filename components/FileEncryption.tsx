'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { encryptFile, decryptFile } from '@/lib/encryption';
import { Download, File as FileIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FileInput } from '@/components/ui/file-input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty';
import { PasswordInput, validatePassword, getPasswordErrorMessage } from '@/components/ui/password-input';

export function FileEncryption() {
    const t = useTranslations();
    const [file, setFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [encryptedData, setEncryptedData] = useState<{ data: ArrayBuffer; iv: Uint8Array; salt: Uint8Array; filename: string; isFolder: boolean } | null>(null);
    const [encryptedFileForDecrypt, setEncryptedFileForDecrypt] = useState<File | null>(null);
    const [decryptPassword, setDecryptPassword] = useState('');
    const [decryptMetadata, setDecryptMetadata] = useState<{ iv: Uint8Array; salt: Uint8Array; filename: string; encryptedData: ArrayBuffer } | null>(null);
    const [decryptedFile, setDecryptedFile] = useState<{ file: File; isFolder: boolean } | null>(null);
    const [decryptError, setDecryptError] = useState<string | null>(null);

    const handleEncrypt = async () => {
        if (!file || !password) {
            alert(t('selectFileAndPassword'));
            return;
        }

        const errors = validatePassword(password);
        if (!errors.minLength || !errors.uppercase || !errors.lowercase || !errors.number || !errors.specialChar) {
            alert(getPasswordErrorMessage(errors, t));
            return;
        }

        try {
            const result = await encryptFile(file, password);
            const isFolder = !!(file as any).webkitRelativePath || file.type === '';
            setEncryptedData({
                data: result.encrypted,
                iv: result.iv,
                salt: result.salt,
                filename: file.name,
                isFolder
            });
        } catch (error) {
            alert(t('errorEncrypting'));
        }
    };

    const handleDecrypt = async () => {
        if (!encryptedFileForDecrypt || !decryptPassword || !decryptMetadata) {
            alert(t('selectFileAndPassword'));
            return;
        }

        const errors = validatePassword(decryptPassword);
        if (!errors.minLength || !errors.uppercase || !errors.lowercase || !errors.number || !errors.specialChar) {
            setDecryptError(getPasswordErrorMessage(errors, t));
            return;
        }

        setDecryptError(null);
        setDecryptedFile(null);

        try {
            if (!decryptMetadata.iv || !decryptMetadata.salt || !decryptMetadata.encryptedData) {
                setDecryptError(t('invalidEncryptedFile'));
                return;
            }

            const iv = decryptMetadata.iv instanceof Uint8Array ? decryptMetadata.iv : new Uint8Array(decryptMetadata.iv);
            const salt = decryptMetadata.salt instanceof Uint8Array ? decryptMetadata.salt : new Uint8Array(decryptMetadata.salt);
            const encryptedData = decryptMetadata.encryptedData;

            const decrypted = await decryptFile(encryptedData, decryptPassword, iv, salt);
            const blob = new Blob([decrypted]);
            const originalFilename = decryptMetadata.filename || encryptedFileForDecrypt.name.replace('.enc', '');
            const file = new File([blob], 'decrypted_' + originalFilename);
            const isFolder = originalFilename.includes('/') || originalFilename.includes('\\');
            setDecryptedFile({ file, isFolder });
            setDecryptError(null);
        } catch (error) {
            if (error instanceof DOMException && (error.name === 'OperationError' || error.name === 'InvalidAccessError')) {
                setDecryptError(t('wrongPassword'));
            } else {
                setDecryptError(t('errorDecrypting'));
            }
        }
    };

    const downloadEncrypted = () => {
        if (!encryptedData) return;

        const metadata = {
            iv: Array.from(encryptedData.iv),
            salt: Array.from(encryptedData.salt),
            filename: encryptedData.filename
        };

        const metadataStr = JSON.stringify(metadata);
        const metadataBase64 = btoa(metadataStr);
        const metadataBytes = new TextEncoder().encode(metadataBase64);
        const combined = new Uint8Array(encryptedData.data.byteLength + metadataBytes.length + 1);
        combined[0] = metadataBytes.length;
        combined.set(metadataBytes, 1);
        combined.set(new Uint8Array(encryptedData.data), 1 + metadataBytes.length);

        const blob = new Blob([combined]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = encryptedData.filename + '.enc';
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadDecrypted = () => {
        if (!decryptedFile) return;
        const url = URL.createObjectURL(decryptedFile.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = decryptedFile.file.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const isPasswordValid = (pwd: string): boolean => {
        if (!pwd) return false;
        const errors = validatePassword(pwd);
        return errors.minLength && errors.uppercase && errors.lowercase && errors.number && errors.specialChar;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2 text-foreground">{t('fileEncryption')}</h1>
            </div>

            <Tabs defaultValue="encrypt" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="encrypt">{t('encrypt')}</TabsTrigger>
                    <TabsTrigger value="decrypt">{t('decrypt')}</TabsTrigger>
                </TabsList>

                <TabsContent value="encrypt" className="space-y-4">
                    <div className={`grid grid-cols-1 ${encryptedData ? 'md:grid-cols-2' : ''} gap-6`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('encryptFile')}</CardTitle>
                                <CardDescription>{t('protectFilesWithPassword')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FileInput
                                    value={file}
                                    onChange={setFile}
                                    label={t('file')}
                                />
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('password')}</label>
                                    <PasswordInput
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={t('encryptionPassword')}
                                        showValidation={true}
                                        t={t}
                                    />
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full">
                                            <Button 
                                                onClick={handleEncrypt} 
                                                className="w-full" 
                                                disabled={!file || !password || !isPasswordValid(password)}
                                            >
                                                {t('encrypt')}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    {(!file || !password) && (
                                        <TooltipContent>
                                            <p>{t('tooltipSelectFileAndPassword')}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </CardContent>
                        </Card>
                        {encryptedData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{encryptedData.isFolder ? t('encryptedFolderReady') : t('encryptedFileReady')}</CardTitle>
                                    <CardDescription>
                                        {encryptedData.isFolder ? t('encryptedFolderDescription') : t('encryptedFileDescription')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <FileIcon className="w-6 h-6" />
                                            </EmptyMedia>
                                            <EmptyTitle>{encryptedData.filename}</EmptyTitle>
                                            <EmptyDescription>
                                                {encryptedData.isFolder ? t('encryptedFolderDescription') : t('encryptedFileDescription')}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        <EmptyContent>
                                            <Button onClick={downloadEncrypted} className="w-full" variant="outline">
                                                <Download className="w-4 h-4 mr-2" />
                                                {encryptedData.isFolder ? t('downloadEncryptedFolder') : t('downloadEncryptedFile')}
                                            </Button>
                                        </EmptyContent>
                                    </Empty>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="decrypt" className="space-y-4">
                    <div className={`grid grid-cols-1 ${decryptedFile ? 'md:grid-cols-2' : ''} gap-6`}>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('decryptFile')}</CardTitle>
                                <CardDescription>{t('decryptFileWithPassword')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FileInput
                                    accept=".enc"
                                    label={t('encryptedFile')}
                                    value={encryptedFileForDecrypt}
                                    onChange={async (file) => {
                                        if (file) {
                                            setEncryptedFileForDecrypt(file);
                                            setDecryptPassword('');
                                            setDecryptError(null);
                                            setDecryptedFile(null);
                                            try {
                                                const arrayBuffer = await file.arrayBuffer();
                                                const view = new Uint8Array(arrayBuffer);
                                                const metadataLength = view[0];
                                                const metadataBytes = view.slice(1, 1 + metadataLength);
                                                const metadataStr = new TextDecoder().decode(metadataBytes);
                                                const metadata = JSON.parse(atob(metadataStr));
                                                const encryptedDataSlice = arrayBuffer.slice(1 + metadataLength);
                                                setDecryptMetadata({
                                                    iv: new Uint8Array(metadata.iv),
                                                    salt: new Uint8Array(metadata.salt),
                                                    filename: metadata.filename || file.name.replace('.enc', ''),
                                                    encryptedData: encryptedDataSlice
                                                });
                                            } catch (error) {
                                                setDecryptError(t('invalidEncryptedFile'));
                                                setEncryptedFileForDecrypt(null);
                                                setDecryptMetadata(null);
                                            }
                                        } else {
                                            setEncryptedFileForDecrypt(null);
                                            setDecryptMetadata(null);
                                            setDecryptedFile(null);
                                            setDecryptError(null);
                                        }
                                    }}
                                />
                                <div>
                                    <label className="text-sm font-medium mb-2 block">{t('password')}</label>
                                    <PasswordInput
                                        value={decryptPassword}
                                        onChange={(e) => {
                                            setDecryptPassword(e.target.value);
                                            setDecryptError(null);
                                        }}
                                        placeholder={t('encryptionPassword')}
                                        showValidation={true}
                                        t={t}
                                    />
                                    {decryptError && (
                                        <p className="text-sm text-destructive mt-2">{decryptError}</p>
                                    )}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="w-full">
                                            <Button 
                                                onClick={handleDecrypt} 
                                                className="w-full" 
                                                disabled={!encryptedFileForDecrypt || !decryptPassword || !isPasswordValid(decryptPassword)}
                                            >
                                                {t('decrypt')}
                                            </Button>
                                        </span>
                                    </TooltipTrigger>
                                    {(!encryptedFileForDecrypt || !decryptPassword) && (
                                        <TooltipContent>
                                            <p>{t('tooltipSelectFileAndPassword')}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </CardContent>
                        </Card>
                        {decryptedFile && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{decryptedFile.isFolder ? t('decryptedFolderReady') : t('decryptedFileReady')}</CardTitle>
                                    <CardDescription>
                                        {decryptedFile.isFolder ? t('decryptedFolderDescription') : t('decryptedFileDescription')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <FileIcon className="w-6 h-6" />
                                            </EmptyMedia>
                                            <EmptyTitle>{decryptedFile.file.name}</EmptyTitle>
                                            <EmptyDescription>
                                                {decryptedFile.isFolder ? t('decryptedFolderDescription') : t('decryptedFileDescription')}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        <EmptyContent>
                                            <Button onClick={downloadDecrypted} className="w-full" variant="outline">
                                                <Download className="w-4 h-4 mr-2" />
                                                {decryptedFile.isFolder ? t('downloadDecryptedFolder') : t('downloadDecryptedFile')}
                                            </Button>
                                        </EmptyContent>
                                    </Empty>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
