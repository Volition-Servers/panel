import NodeConfigurationContainer from '@/components/admin/nodes/NodeConfigurationContainer';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import tw from 'twin.macro';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { action, Action, Actions, createContextStore, useStoreActions } from 'easy-peasy';
import { Node } from '@/api/admin/nodes/getNodes';
import getNode from '@/api/admin/nodes/getNode';
import AdminContentBlock from '@/components/admin/AdminContentBlock';
import Spinner from '@/components/elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import { ApplicationStore } from '@/state';
import { SubNavigation, SubNavigationLink } from '@/components/admin/SubNavigation';
import AdminBox from '@/components/admin/AdminBox';
import NodeLimitContainer from '@/components/admin/nodes/NodeLimitContainer';
import NodeSettingsContainer from '@/components/admin/nodes/NodeSettingsContainer';

interface ctx {
    node: Node | undefined;
    setNode: Action<ctx, Node | undefined>;
}

export const Context = createContextStore<ctx>({
    node: undefined,

    setNode: action((state, payload) => {
        state.node = payload;
    }),
});

const Code = ({ children }: { children: React.ReactNode }) => {
    return (
        <code css={tw`text-sm font-mono bg-neutral-900 rounded`} style={{ padding: '2px 6px' }}>
            {children}
        </code>
    );
};

const NodeEditContainer = () => {
    const location = useLocation();
    const match = useRouteMatch<{ id?: string }>();

    const { clearFlashes, clearAndAddHttpError } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
    const [ loading, setLoading ] = useState(true);

    const node = Context.useStoreState(state => state.node);
    const setNode = Context.useStoreActions(actions => actions.setNode);

    useEffect(() => {
        clearFlashes('node');

        getNode(Number(match.params?.id), [ 'database_host', 'location' ])
            .then(node => setNode(node))
            .catch(error => {
                console.error(error);
                clearAndAddHttpError({ key: 'node', error });
            })
            .then(() => setLoading(false));
    }, []);

    if (loading || node === undefined) {
        return (
            <AdminContentBlock>
                <FlashMessageRender byKey={'node'} css={tw`mb-4`}/>

                <div css={tw`w-full flex flex-col items-center justify-center`} style={{ height: '24rem' }}>
                    <Spinner size={'base'}/>
                </div>
            </AdminContentBlock>
        );
    }

    return (
        <AdminContentBlock title={'Node - ' + node.name}>
            <div css={tw`w-full flex flex-row items-center mb-6`}>
                <div css={tw`flex flex-col flex-shrink`} style={{ minWidth: '0' }}>
                    <h2 css={tw`text-2xl text-neutral-50 font-header font-medium`}>{node.name}</h2>
                    <p css={tw`text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden`}>{node.uuid}</p>
                </div>
            </div>

            <FlashMessageRender byKey={'node'} css={tw`mb-4`}/>

            <SubNavigation>
                <SubNavigationLink to={`${match.url}`} name={'About'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path clipRule="evenodd" fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" />
                    </svg>
                </SubNavigationLink>

                <SubNavigationLink to={`${match.url}/settings`} name={'Settings'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path clipRule="evenodd" fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                </SubNavigationLink>

                <SubNavigationLink to={`${match.url}/configuration`} name={'Configuration'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path clipRule="evenodd" fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                </SubNavigationLink>

                <SubNavigationLink to={`${match.url}/allocations`} name={'Allocations'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                </SubNavigationLink>

                <SubNavigationLink to={`${match.url}/servers`} name={'Servers'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                    </svg>
                </SubNavigationLink>
            </SubNavigation>

            <Switch location={location}>
                <Route path={`${match.path}`} exact>
                    <AdminBox title={'Node Information'}>
                        <p>Version <Code>1.2.2</Code></p>
                    </AdminBox>
                </Route>

                <Route path={`${match.path}/settings`} exact>
                    <div css={tw`flex flex-col lg:flex-row`}>
                        <div css={tw`w-full lg:w-1/2 flex flex-col mr-0 lg:mr-2`}>
                            <NodeSettingsContainer/>
                        </div>

                        <div css={tw`w-full lg:w-1/2 flex flex-col ml-0 lg:ml-2 mt-4 lg:mt-0`}>
                            <NodeLimitContainer/>
                        </div>
                    </div>
                </Route>

                <Route path={`${match.path}/configuration`} exact>
                    <NodeConfigurationContainer/>
                </Route>

                <Route path={`${match.path}/allocations`} exact>
                    <p>Allocations</p>
                </Route>

                <Route path={`${match.path}/servers`} exact>
                    <p>Servers</p>
                </Route>
            </Switch>
        </AdminContentBlock>
    );
};

export default () => {
    return (
        <Context.Provider>
            <NodeEditContainer/>
        </Context.Provider>
    );
};
