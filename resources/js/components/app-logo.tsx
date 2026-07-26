import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate font-display text-sm leading-tight font-semibold tracking-tight">
                    EcoTrack
                </span>
                <span className="truncate text-[10px] leading-tight text-sidebar-foreground/70">
                    Energy &amp; water
                </span>
            </div>
        </>
    );
}
