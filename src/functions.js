import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alerta(mensaje,icono,foco=''){
    onFocus(foco);
    const MySwall = withReactContent(Swal);
    MySwall.fire({
        title:mensaje,
        icon:icono
    });
}

function onFocus(foco){
    if(foco !== ''){
        document.getElementById(foco).focus();
    }
}