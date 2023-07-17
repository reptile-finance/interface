import React, { ErrorInfo, PropsWithChildren } from 'react';
import { toast } from 'react-hot-toast';

export class ErrorBoundary extends React.Component<PropsWithChildren, { hasError: boolean; error: Error | undefined }> {
    constructor(props: PropsWithChildren) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('ReptileError:', error, info);
        toast.error(error.message);
    }

    public render() {
        if (this.state.hasError) {
            return <h1>500</h1>;
        }

        return this.props.children;
    }
}
