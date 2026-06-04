import { App } from 'antd';

let notificationInstance: ReturnType<typeof App.useApp>['notification'];

export const ToastHolder = () => {
    const { notification } = App.useApp();
    notificationInstance = notification;
    return null;
};

export const toast = {
    success: (message: string) =>
        notificationInstance?.success({
            title: null,
            description: (
                <div style={{ fontSize: 14 }}>
                    {message}
                </div>
            ),
            placement: 'topRight',
            style: {
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
            },
        }),

    error: (message: string) =>
        notificationInstance?.error({
            title: null,
            description: (
                <div style={{ fontSize: 14 }}>
                    {message}
                </div>
            ),
            placement: 'topRight',
            style: { backgroundColor: '#fff1f0', borderColor: '#ffa39e'},
        }),
};