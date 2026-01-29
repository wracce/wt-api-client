var __oResulter = {'error':0, 'messageText':'','result':'','type':'void'};
TopElem = Child(0).Parent;
try
{
	oArgVars;
	if(DataType(oArgVars) == 'string')
		oArgVars = ParseJson(oArgVars);
}
catch(e)
{
	oArgVars = {};
}
var bArgVarHasAttribute = false;
for(i in oArgVars)
	bArgVarHasAttribute = true;
var MESSAGE = '';
var ERROR = 0;
var RESULT = new Object;
var PARAMETERS = new Object;
if ( TopElem.exec_code.code_type == 'cs' ) //С#
{
	wait = false;
	single = true;
	max_run_time = 120;
	oAssembly = tools.get_object_assembly( 'DatexCore' );
	oParseResult = oAssembly.CallClassStaticMethod( 'Datex.Core.CSharp', 'Parse', [ 1, TopElem.id, TopElem.code, TopElem.Name, TopElem.exec_code.code_text ] ); //Server Agent
	if ( oParseResult.Success )
	{
		oAssemblyResult = tools.dotnet_host.Object.GetAssembly( oParseResult.AssemblyName );
		oAssemblyResult.CallClassStaticMethod( oParseResult.EntryPointMemberFullName, '', [], single, wait,max_run_time );
	}
	else
	{
	}
}
else
{
	try
	{
		Request;
		Env = Request.Session.GetOptProperty('Env', ({}));
		InPlaceEval( tools_web.env_to_script( Env ) );
	}
	catch ( err )
	{
		ERROR = 1;
		MESSAGE = ms_tools.get_const('neobhodimoobno');
	}
	try
	{
		sRefererUrl = UrlDecode( Child(0).Parent.view.referer_url );
		sEnvUrl = tools_web.get_cur_env_url( Env );
		oInitQuery = sRefererUrl == '' || sEnvUrl == sRefererUrl ? { 'doc_id': ( Env.curDocID == null ? '' : Env.curDocID ), 'object_id': ( Env.curObjectID == null ? '' : Env.curObjectID ), 'mode': Env.GetOptProperty('curMode', null) } : tools_web.get_url_query( sRefererUrl );
		EnvObject = tools_web.object_init( Request.Session, oInitQuery );
		Env.SetProperty( 'curDocID', curDocID = EnvObject.GetProperty( 'curDocID' ) );
		curDoc = EnvObject.GetProperty( 'curDoc' );
		Env.SetProperty( 'curDocSid', curDocSid = EnvObject.GetProperty( 'curDocSid' ) );
		Env.SetProperty( 'curObjectID', curObjectID = EnvObject.GetProperty( 'curObjectID' ) );
		curObjectDoc = EnvObject.GetProperty( 'curObjectDoc' );
		curObject = curObjectDoc == null ? null : curObjectDoc.TopElem;
		Env.SetProperty( 'curMode', curMode = Env.GetOptProperty('curMode', null) );
	}
	catch ( err )
	{
		if ( global_settings.debug )
			alert( err );
	}
	try
	{
		curUserID = Env.GetOptProperty( 'curUserID', null );
		curUser = Env.GetOptProperty( 'curUser', null );
	}
	catch ( err )
	{
		curUserID = null;
		curUser = null;
	}
	try
	{
		if ( curUserID != null )
		{
			Request.AuthUserID = curUserID;
			Request.AuthLogin = curUser.login.Value;
			tools_web.set_st_category( curUser );
		}
	}
	catch ( err )
	{
		if ( global_settings.debug )
			alert( err );
	}
	if ( ERROR == 0 )
	{
		if ( ! tools_web.check_access( TopElem, curUserID, curUser, Request.Session ) )
		{
			ERROR = 1;
			MESSAGE = ms_tools.get_const('nedostatochnopr');
		}
	}
	if ( ERROR == 0 )
	{
		try
		{
			if(bArgVarHasAttribute)
			{
				if ( oArgVars.GetOptProperty( 'command' ) == undefined )
				{
					oArgVars.SetProperty( 'command', 'eval' );
				}
				PARAMETERS = {};
				for(attribArgVars in oArgVars)
				{
					PARAMETERS.SetProperty(attribArgVars, oArgVars[attribArgVars].value)
				}
				SCOPE_WVARS = PARAMETERS;
				var s_anti_str = tools.object_to_script(oArgVars, false);
			}
			else
			{
				if ( TopElem.wvars.GetOptChildByKey( 'command' ) == undefined )
				{
					TopElem.wvars.ObtainChildByKey( 'command' ).value = 'eval';
				}
				PARAMETERS = tools.wvars_to_object( TopElem.wvars );
				SCOPE_WVARS = PARAMETERS;
				var s_anti_str = tools.wvars_to_script(TopElem.wvars, false);
			}
			var sRenderUrl = TopElem.url.Value;
			if ( sRenderUrl != '' && ! IsAbsoluteUrlStr( TopElem.url ) )
				sRenderUrl = UrlAppendPath( global_settings.web_path, TopElem.url );
			if ( TopElem.type == 'page' )
			{
				s_anti_str = '&lt;%' + StrReplace( StrReplace( s_anti_str, '&lt;%', '&lt; %' ), '%&gt;', '% &gt;' ) + '%&gt;';
				if ( sRenderUrl == '' )
					EvalCodePage( (s_anti_str + TopElem.script.Value), true );
				else
					EvalCodePage( (s_anti_str + LoadUrlText(sRenderUrl)), true );
			}
			else
			{
				if ( sRenderUrl == '' )
					eval(s_anti_str + TopElem.script.Value);
				else
					eval(s_anti_str + LoadUrlText(sRenderUrl));
			}
		}
		catch(_X_)
		{
			if ( ! IsCancelError( _X_ ) )
			{
				alert(_X_);
				ERROR = 1;
				MESSAGE = 'Error evaluating action ' + TopElem.name.XQueryLiteral + '\n' + _X_;
			}
		}
	}
}
__oResulter.error = OptInt(ERROR,0);
__oResulter.messageText = ( '' + MESSAGE );
if (sResultTypePARAM == 'raw')
	__oResulter.result = RESULT;
else
	__oResulter.result = (DataType(RESULT) == 'object' ? tools.object_to_text(RESULT, sResultTypePARAM) : '');
return __oResulter;