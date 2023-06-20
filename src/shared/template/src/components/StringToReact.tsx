import React, { useRef } from 'react';

import PropTypes from 'prop-types';

import Context from '../utils/context';

const getContext = (options: any) => new Context(options);

interface StringToReactProps {
    data?: object;
    babelOptions?: object;
}

const StringToReact: React.FC<React.PropsWithChildren<StringToReactProps>> = (props) => {
    const ref = useRef<Context | null>(null);

    if (!ref.current) ref.current = getContext(React);

    const babelOptions = props.babelOptions || {};

    const Generated = ref.current.updateTemplate(props.children as string, babelOptions).getComponent();

    if (!Generated) return null;

    const data = props.data || {};

    return <Generated {...data} />;
}

StringToReact.propTypes = {
    data: PropTypes.object,
    babelOptions: PropTypes.object,
};

export default StringToReact;