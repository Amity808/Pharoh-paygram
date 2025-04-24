import Blockies from 'react-blockies';


interface IdenticonAddressProps {
    address: string;
    size: number;
}

export const IdenticonAddress: React.FC<IdenticonAddressProps> = ({ address, size }) => {
    return (
        <>
            <Blockies size={size} scale={4} className="identicon border-2 border-white rounded-full" seed={address} />
        </>
    )
}